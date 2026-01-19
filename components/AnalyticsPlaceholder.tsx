import Script from "next/script";

export const AnalyticsPlaceholder = () => {
  return (
    <Script id="analytics-placeholder" strategy="afterInteractive">
      {`window.__analyticsPlaceholder = true;`}
    </Script>
  );
};
