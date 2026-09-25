import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfile";

const TRACKING_TAG_ATTRIBUTE = "data-dynamic-tracking-tag";

const copyAttributes = (from: Element, to: Element) => {
  Array.from(from.attributes).forEach((attr) => {
    to.setAttribute(attr.name, attr.value);
  });
};

const appendTrackingNode = (node: ChildNode) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return;
  }

  if (!(node instanceof Element)) return;

  const tagName = node.tagName.toLowerCase();
  const parent = tagName === "noscript" ? document.body : document.head;

  if (tagName === "script") {
    const script = document.createElement("script");
    copyAttributes(node, script);
    script.textContent = node.textContent;
    script.setAttribute(TRACKING_TAG_ATTRIBUTE, "true");
    parent.appendChild(script);
    return;
  }

  const clone = node.cloneNode(true) as Element;
  clone.setAttribute(TRACKING_TAG_ATTRIBUTE, "true");
  parent.appendChild(clone);
};

const clearTrackingTags = () => {
  document
    .querySelectorAll(`[${TRACKING_TAG_ATTRIBUTE}="true"]`)
    .forEach((element) => element.remove());
};

// Third-party scripts never run in the admin panel, where the page holds the login session.
const isAdminPath = (pathname: string) => pathname === "/admin" || pathname.startsWith("/admin/");

const TrackingTags = () => {
  const { data: profiles = [] } = useProfiles();
  const trackingTags = profiles[0]?.tracking_tags;
  const inAdmin = isAdminPath(useLocation().pathname);

  useEffect(() => {
    clearTrackingTags();

    if (inAdmin || !trackingTags?.trim()) return;

    const template = document.createElement("template");
    template.innerHTML = trackingTags;

    Array.from(template.content.childNodes).forEach(appendTrackingNode);

    return clearTrackingTags;
  }, [trackingTags, inAdmin]);

  return null;
};

export default TrackingTags;
