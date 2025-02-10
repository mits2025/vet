declare module '@/Data/cebu-addresses.json' {
    export interface Barangays {
        [barangay: string]: string; // Barangay name maps to postal code
    }

    export interface Municipality {
        barangays: Barangays;
    }

    export interface CebuAddresses {
        Cebu: {
            municipalities: Record<string, Municipality>;
        };
    }

    const value: CebuAddresses;
    export default value;
}
