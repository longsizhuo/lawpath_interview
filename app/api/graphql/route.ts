import { ApolloServer } from "@apollo/server";
import {startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export type Locality = {
    id: string;
    location: string;
    postcode: number;
    state: string;
    category: string;
    latitude: number;
    longitude: number;
}

const typeDefs = gql`
    type Locality {
        id: ID
        location: String
        postcode: Int
        state: String
        category: String
        latitude: Float
        longitude: Float
    }

    type Query {
        validateAddress(suburb: String!, postcode: Int!, state: String!): [Locality]  # ✅ 改成返回数组
    }
`;


const resolvers = {
    Query: {
        validateAddress: async (_: unknown, { suburb, postcode, state }: {suburb: string; postcode: number; state: string}) => {
            const API_URL =
                "https://gavg8gilmf.execute-api.ap-southeast-2.amazonaws.com/staging/postcode/search.json";
            const API_KEY = process.env.API_KEY;

            if (!API_KEY) {
                throw new Error("API_KEY is not defined in environment variables");
            }

            const response = await fetch(`${API_URL}?q=${suburb}&state=${state}`, {
                headers: { Authorization: `Bearer ${API_KEY}` },
            });

            if (!response.ok) {
                throw new GraphQLError(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const localitiesRaw = data.localities.locality;
            const localities = Array.isArray(localitiesRaw) ? localitiesRaw : [localitiesRaw];


            if (!localities || localities.length === 0) {
                throw new GraphQLError(`The suburb ${suburb} does not exist in the state ${state}.`);
            }

            const matchingLocality = localities.find(
                (loc: { postcode: number }) => loc.postcode === postcode
            );

            if (!matchingLocality) {
                throw new GraphQLError(`The postcode ${postcode} does not match the suburb ${suburb}.`);
            }

            return localities.map((locality: Locality) => ({
                id: locality.id,
                location: locality.location,
                postcode: locality.postcode,
                state: locality.state,
                category: locality.category,
                latitude: locality.latitude,
                longitude: locality.longitude,
            }));
        },
    },
};


const server = new ApolloServer({ typeDefs, resolvers });

export const POST = startServerAndCreateNextHandler(server);