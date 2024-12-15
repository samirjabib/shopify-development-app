import { LoaderFunctionArgs } from "@remix-run/node";
import { Card, Layout, Page, Text } from "@shopify/polaris";
import { authenticate, apiVersion } from "app/shopify.server";


import { useLoaderData, useRouteError } from '@remix-run/react';
import { boundary } from "@shopify/shopify-app-remix/server";
import { GetCollectionsQuery } from "app/types/admin.generated";

export function ErrorBoundary() {
    return boundary.error(useRouteError());
}



export type LoaderDataType = {
    collections: GetCollectionsQuery["collections"];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    console.log("soy el console log de loader");
    const { admin } = await authenticate.admin(request);
    try {
        const response = await admin.graphql(
            `#graphql
                query GetCollections {
                    collections(first: 10) {
                        edges {
                            node {
                                title
                                handle
                                id
                            }
                        }
                    }
                }
            `,
            {
                apiVersion,
            }
        );

        const data = await response.json(); // Read the response body once
        console.log(data.data?.collections, 'im the response');
        if (response.ok) {
            return {
                collections: data.data?.collections
            }
        }

        return null;
    } catch (error) {
        console.log(error);
    }
    return null;
};

const Collections = () => {
    const { collections } = useLoaderData<LoaderDataType>();
    console.log("Collections", collections);
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="h1">Collections</Text>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default Collections;