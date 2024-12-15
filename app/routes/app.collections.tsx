import { Card, Layout, Page, Text } from "@shopify/polaris";
const Collections = () => {
    console.log("Collections");
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