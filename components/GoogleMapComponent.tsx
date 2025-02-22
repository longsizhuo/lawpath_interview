"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


const containerStyle = {
    width: "100%",
    height: "400px",
};

export default function GoogleMapComponent({ latitude, longitude }: { latitude: number; longitude: number }) {
    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap mapContainerStyle={containerStyle} center={{ lat: latitude, lng: longitude }} zoom={14}>
                <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
        </LoadScript>
    );
}
