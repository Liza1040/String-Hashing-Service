import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";


export default function MyApp(props) {
    const { Component, pageProps } = props;
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <title>Next.js Хеширование</title>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <Component {...pageProps} />
        </SessionProvider>

    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};