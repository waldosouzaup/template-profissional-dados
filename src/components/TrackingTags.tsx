import { useEffect } from "react";
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

const TrackingTags = () => {
  const { data: profiles = [] } = useProfiles();
  const trackingTags = profiles[0]?.tracking_tags;

  useEffect(() => {
    clearTrackingTags();

    if (!trackingTags?.trim()) return;

    const template = document.createElement("template");
    template.innerHTML = trackingTags;

    Array.from(template.content.childNodes).forEach(appendTrackingNode);

    return clearTrackingTags;
  }, [trackingTags]);

  return null;
};

export default TrackingTags;
