"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gql, useLazyQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Locality } from "@/app/api/graphql/route";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { useState, useEffect } from "rehackt";
import ThreeBackground from "@/components/ThreeCanvas"; // 引入 three.js 背景组件

// GraphQL Query
const VALIDATE_ADDRESS = gql`
    query ValidateAddress($suburb: String!, $postcode: Int!, $state: String!) {
        validateAddress(suburb: $suburb, postcode: $postcode, state: $state) {
            id
            location
            postcode
            state
            category
            latitude
            longitude
        }
    }
`;

// Zod validation schema
const formSchema = z.object({
    suburb: z.string().min(2, "Suburb must be at least 2 characters"),
    postcode: z.number().int().positive().gte(200).lte(9729),
    state: z.enum(["NSW", "VIC", "QLD", "WA", "SA", "TAS"]).default("NSW"),
});

export default function AddressForm() {
    // save API response data
    const [addresses, setAddresses] = useState<Locality[]>([]);
    // When coordinates are selected, save the selected location
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    // When there's an address with no coordinates, save the message
    const [selectedAddressMessage, setSelectedAddressMessage] = useState<string | null>(null);

    const [validateAddress, { data, error, loading }] = useLazyQuery(VALIDATE_ADDRESS);

    useEffect(() => {
        if (data?.validateAddress) {
            setAddresses(data.validateAddress);
            // Do not select the location if there are multiple addresses
            setSelectedLocation(null);
            setSelectedAddressMessage(null);
        }
    }, [data]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            suburb: "",
            postcode: 2018, // Where I live, ez for testing
            state: "NSW",
        } as const,
    });

    const onSubmit = (values: { suburb: string; postcode: number; state: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" }) => {
        validateAddress({
            variables: {
                suburb: values.suburb,
                postcode: values.postcode,
                state: values.state,
            },
        }).then(r => console.log(r));
    };

    // handle the click event of the address
    const handleSelectAddress  = (location: Locality) => {
        if (location.latitude && location.longitude) {
            setSelectedLocation({ lat: location.latitude, lng: location.longitude });
            setSelectedAddressMessage(null);
        } else {
            setSelectedLocation(null);
            setSelectedAddressMessage("This address does not have coordinates.");
        }
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            {/* Three.js background in the middle layer */}
            <ThreeBackground />
            {/* Main content on top */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full py-10">
                <div className="w-full max-w-5xl mx-auto p-8 bg-white/90 backdrop-blur-sm border rounded-lg shadow-xl">
                    <h2 className="text-3xl font-bold mb-6 text-center">Validate Address</h2>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="suburb"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Suburb</Label>
                                        <FormControl>
                                            <Input placeholder="Enter suburb" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="postcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Postcode</Label>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter postcode"
                                                {...field}
                                                type="number"
                                                onChange={(e) =>
                                                    field.onChange(e.target.value ? parseInt(e.target.value, 10) : "")
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>State</Label>
                                        <FormControl>
                                            <select {...field} className="border p-2 rounded w-full">
                                                <option value="">Select State</option>
                                                <option value="NSW">New South Wales (NSW)</option>
                                                <option value="VIC">Victoria (VIC)</option>
                                                <option value="QLD">Queensland (QLD)</option>
                                                <option value="WA">Western Australia (WA)</option>
                                                <option value="SA">South Australia (SA)</option>
                                                <option value="TAS">Tasmania (TAS)</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full py-3">
                                Validate
                            </Button>
                        </form>
                    </Form>

                    {/* Loading and Error Messages */}
                    {loading && <p className="mt-4 text-center text-gray-700">Validating...</p>}
                    {error && <p className="mt-4 text-center text-red-500">{error.message}</p>}

                    {/* Address List */}
                    {addresses.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-center text-green-600 font-semibold">
                                Please Select One Address:
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {addresses.map((locality: Locality) => (
                                    <li
                                        key={locality.id}
                                        className="p-4 border rounded bg-gray-50 shadow flex justify-between items-center"
                                    >
                                        <div>
                                            <p>
                                                <strong>Location:</strong> {locality.location}, {locality.state} (
                                                {locality.postcode})
                                            </p>
                                            <p>
                                                <strong>Category:</strong> {locality.category}
                                            </p>
                                            <p>
                                                <strong>Coordinates:</strong>{" "}
                                                {locality.latitude != null && locality.longitude != null
                                                    ? `${locality.latitude}, ${locality.longitude}`
                                                    : "No Map"}
                                            </p>
                                        </div>
                                        {locality.latitude != null && locality.longitude != null ? (
                                            <Button onClick={() => handleSelectAddress(locality)} className="ml-4">
                                                Show on Map
                                            </Button>
                                        ) : (
                                            <span className="text-red-500 ml-4">No Map</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Message if address has no coordinates */}
                    {selectedAddressMessage && (
                        <p className="mt-4 text-center text-red-500">{selectedAddressMessage}</p>
                    )}

                    {/* Google Map */}
                    {selectedLocation && (
                        <div className="mt-8">
                            <h3 className="text-center font-semibold text-lg">Google Maps Location:</h3>
                            <GoogleMapComponent
                                latitude={selectedLocation.lat}
                                longitude={selectedLocation.lng}
                            />
                        </div>
                    )}

                    {/* No matching address */}
                    {addresses.length === 0 && data?.validateAddress && (
                        <p className="mt-4 text-center text-red-500">No matching address found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}