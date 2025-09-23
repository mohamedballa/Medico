import "./bootstrap";
import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "../css/app.css";
import Layout from "@/Layouts/Layout";

createInertiaApp({
    title:title => title ? `${title} - Medicosolomed` : "Medicosolomed" ,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        page.default.layout =
            page.default.layout ||
            ((page) => 
                <Layout children={page} />    
            );
            return page ;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress : {
      //  color: "#fff"
      //  showSpinner: false || true
      // review inertiajs progress indicator
    }
});
