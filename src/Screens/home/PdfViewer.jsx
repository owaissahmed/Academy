import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Container from '../../components/Container';

const BRAND = '#2e4c60';

/**
 * PdfViewer
 *
 * Navigate here with:
 * navigation.navigate('PdfViewer', { url: item.viewUrl, title: item.name })
 *
 * Expects a Google Drive "preview" style URL
 * (e.g. https://drive.google.com/file/d/FILE_ID/preview)
 * which Drive itself renders as an embedded PDF viewer — so it
 * opens fully in-app, no external browser or app is triggered.
 */
const PdfViewer = ({ route, navigation }) => {
    const { url, title } = route.params || {};
    const [loading, setLoading] = useState(true);

    return (
        <Container
            showHeader={true}
            headerTitle={title || 'View Book'}
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            <View style={styles.container}>
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    startInLoadingState={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={['*']}
                />

                {loading && (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color={BRAND} />
                    </View>
                )}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    webview: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
});

export default PdfViewer;