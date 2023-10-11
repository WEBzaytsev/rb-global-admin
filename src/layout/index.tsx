import Header from "./header";
import Sidebar from "./sidebar";

const SiderLayout = Layout.Sider;
const HeaderLayout = Layout.Header;
const FooterLayout = Layout.Footer;
const ContentLayout = Layout.Content;

import { Layout } from '@arco-design/web-react';
import {ReactNode} from "react";
interface Props {
    children: string | ReactNode | ReactNode[];
}

const LayoutPage = ({children}: Props) => {
    return (
        <Layout>
            <HeaderLayout>
                <Header />
            </HeaderLayout>
            <Layout style={{paddingLeft: 24, paddingRight: 24}}>
                <SiderLayout style={{marginRight: 70, background: 'none', boxShadow: "none"}}>
                    <Sidebar />
                </SiderLayout>
                <ContentLayout>
                    {children}
                </ContentLayout>
            </Layout>
        </Layout>
    )
}

export default LayoutPage;