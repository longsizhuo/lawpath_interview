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
    postcode: z.number().int().positive().gte(200).lte(9729),  // ✅ number
    state: z.enum(["NSW", "VIC", "QLD", "WA", "SA", "TAS"]).default("NSW"),
});

export default function AddressForm() {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [validateAddress, { data, error, loading }] = useLazyQuery(VALIDATE_ADDRESS);
    useEffect(() => {
        if (data?.validateAddress?.length > 0) {
            const locality = data.validateAddress[0]; // 选取第一个匹配的地址
            setSelectedLocation({ lat: locality.latitude, lng: locality.longitude });
        }
    }, [data]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            suburb: "",
            postcode: 1000,
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

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">Validate Address</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : "")}
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

                    <Button type="submit" className="w-full">
                        Validate
                    </Button>
                </form>
            </Form>
            <div className="max-w-md mx-auto p-6 border rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold mb-4">Validate Address</h2>

                {selectedLocation && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-lg">Google Maps Location:</h3>
                        <GoogleMapComponent latitude={selectedLocation.lat} longitude={selectedLocation.lng} />
                    </div>
                )}
            </div>

            {loading && <p>Validating...</p>}

            {error && <p className="text-red-500">{error.message}</p>}

            {data?.validateAddress && data.validateAddress.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-green-600 font-semibold">✅ The postcode, suburb, and state input are valid.</h3>
                    <ul className="mt-2 space-y-2">
                        {data.validateAddress.map((locality: Locality) => (
                            <li key={locality.id} className="p-3 border rounded bg-gray-50 shadow">
                                <p><strong>📍 Location:</strong> {locality.location}, {locality.state} ({locality.postcode})</p>
                                <p><strong>📌 Category:</strong> {locality.category}</p>
                                <p><strong>🌍 Coordinates:</strong> {locality.latitude}, {locality.longitude}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {data?.validateAddress?.length === 0 && <p className="text-red-500">❌ No matching address found.</p>}

        </div>
    );
}
