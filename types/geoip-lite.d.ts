declare module "geoip-lite" {
  interface Lookup {
    range: [number, number];
    country: string;
    region: string;
    city: string;
    ll: [number, number];
    metro: number;
    zip: number;
  }
  function lookup(ip: string): Lookup | null;
import geoip from "geoip-lite";

export default geoip;
}
