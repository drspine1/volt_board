import mongoose from "mongoose";
import dns from "node:dns";

// Atlas uses mongodb+srv (DNS SRV). On some Windows networks IPv6/DNS order breaks SRV lookup (querySrv ECONNREFUSED).
if ("setDefaultResultOrder" in dns) {
  dns.setDefaultResultOrder("ipv4first");
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env.local");

const cached = global as typeof global & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!cached.mongoose) cached.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.mongoose!.conn) return cached.mongoose!.conn;

  if (!cached.mongoose!.promise) {
    cached.mongoose!.promise = (async () => {
      try {
        const m = await mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 10_000,
          family: 4,
        });
        console.log("[db] MongoDB connected successfully");

        // Old schemas sometimes had unique index on `phone` without sparse: true.
        // Then only one user can have missing phone; additional signups fail with E11000.
        try {
          const coll = m.connection.collection("users");
          const specs = (await coll.indexes()) as { name?: string; sparse?: boolean }[];
          const phoneIdx = specs.find((x) => x.name === "phone_1");
          if (phoneIdx && !phoneIdx.sparse) {
            await coll.dropIndex("phone_1");
            console.log("[db] Dropped legacy non-sparse unique index on phone (fixes multi-signup)");
          }
        } catch {
          /* collection/index missing — fine */
        }

        return m;
      } catch (err) {
        cached.mongoose!.promise = null;
        console.error(
          "[db] MongoDB connection failed:",
          err instanceof Error ? err.message : err
        );
        throw err;
      }
    })();
  }

  cached.mongoose!.conn = await cached.mongoose!.promise;
  return cached.mongoose!.conn;
}
