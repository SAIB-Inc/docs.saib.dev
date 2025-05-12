import React from "react";

export default function ExternalLink(prop: React.ComponentProps<'a'>) {
    return (
        <a {...prop}  target="_blank" rel="noopener norefferer"/>
    );
}