// Maps a resource to a visual "category" based on its capacity, so each
// card gets a fitting icon, color theme, and a matching real photo.
export function getResourceVisual(resource) {
  const capacity = resource.capacity || 1;

  if (capacity <= 2) {
    return {
      category: "Desk",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      solid: "#4facfe",
      icon: "desk",
      photoTags: "office,desk,workspace",
    };
  }
  if (capacity <= 6) {
    return {
      category: "Meeting Room",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      solid: "#43e97b",
      icon: "meeting",
      photoTags: "meetingroom,office",
    };
  }
  return {
    category: "Conference Room",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    solid: "#667eea",
    icon: "conference",
    photoTags: "conferenceroom,office",
  };
}

// Tiny deterministic string hash -> used to "lock" LoremFlickr to the same
// photo for a given resource on every load, instead of a random one each time.
function hashToLock(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return (h % 5000) + 1;
}

// Real, topically-matching stock photo (free, no API key) for a resource's
// banner. Used as a background-image layered under a dark gradient overlay;
// if the photo fails to load, the CSS backgroundColor fallback (visual.solid)
// still shows through, so the banner never looks broken.
export function getResourceImageUrl(resource, visual) {
  const lock = hashToLock(resource.id || resource.name || "resource");
  return `https://loremflickr.com/640/360/${visual.photoTags}?lock=${lock}`;
}
