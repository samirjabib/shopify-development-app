import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { Card, Layout, Page, Text } from "@shopify/polaris";
import { boundary } from "@shopify/shopify-app-remix/server";
import { authenticate, apiVersion } from "app/shopify.server";
import { GetProductsQuery } from "app/types/admin.generated";

export function ErrorBoundary() {
    return boundary.error(useRouteError());
}



export type LoaderProductsType = {
    products: GetProductsQuery["products"]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    console.log("soy el console log de loader");
    const { admin } = await authenticate.admin(request);
    try {
        const response = await admin.graphql(
            `#graphql
                query GetProducts {
                    products(first: 10) {
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
        console.log(data.data?.products, 'im the response');
        if (response.ok) {
            return {
                products: data.data?.products
            }
        }

        return null;
    } catch (error) {
        console.log(error);
    }
    return null;
};

const Products = () => {
    const { products } = useLoaderData<LoaderProductsType>();
    return <Page>

        <Layout>
            <Layout.Section>
                <Card>
                    {products?.edges.map((product) => (
                        <Text key={product.node.id} as="p">{product.node.title}</Text>
                    ))}
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
};

export default Products;