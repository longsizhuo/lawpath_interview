import { ApolloProviderWrapper } from "@/lib/apollo-provider";
import AddressForm from "@/components/Form";

export default function Home() {
    return (
        <ApolloProviderWrapper>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
                <AddressForm />
            </main>
        </ApolloProviderWrapper>
    );
}
