"use client";
import React from "react";
import Component from "./api-res";

export default function api() {
    return (
        <main>
            <Component fetching responses={[]} errorOccurred fetchSuccess/>
        </main>
    )
}