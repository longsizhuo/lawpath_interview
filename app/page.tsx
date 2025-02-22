import { ApolloProviderWrapper } from "@/lib/apollo-provider";
import AddressForm from "@/components/Form";

export default function Home() {
    if (process.env.NODE_ENV === 'development') {
        const originalConsoleError = console.error;
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Hydration')) {
                // HydroError causes by 3D model, it can be ignored.
                return;
            }
            originalConsoleError(...args);
        };
    }
    return (
        <ApolloProviderWrapper>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
                <AddressForm />
            </main>
        </ApolloProviderWrapper>
    );
}
