import manifest from "../../../scripts/image-manifest.json";
import placeholder from "../../assets/images/placeholder.jpg";
import { placeImages } from "../../data/placeImages";
export default function ImageManagerScreen() {
  return (
    <div
  style={{
    padding: 24,
    background: "#0B1220",
    minHeight: "100vh",
    color: "white",
  }}
>
      <h1>Image Manager</h1>

      <p>
        Found <strong>{manifest.length}</strong> attractions.
      </p>

      <div style={{ height: 24 }} />

      {manifest.map((place) => {
  const hasImage = Boolean(
  placeImages[`${place.city}/${place.slug}`]
);

const image =
  placeImages[`${place.city}/${place.slug}`] ??
  placeholder;

  return (
        <div
          key={place.id}
          style={{
  background: "#182131",
  padding: 20,
  borderRadius: 14,
  marginBottom: 16,
}}
        >
          <img
  src={image}
  alt={place.name}
  style={{
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 16,
  }}
/>
<h2
  style={{
    margin: "0 0 8px",
    fontSize: 22,
    fontWeight: 700,
  }}
>
  {place.name}
</h2>

         <p
  style={{
    color: "#9CA3AF",
  }}
>
  📍 {place.city}
</p>

          <p
  style={{
    color: hasImage
      ? "#10B981"
      : "#F59E0B",
    fontWeight: 600,
  }}
>
  {hasImage
    ? "✅ Image Added"
    : "⚠️ Missing Image"}
</p>
<button
  style={{
    marginTop: 12,
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#2563EB",
    color: "white",
    fontWeight: 600,
  }}
  onClick={() => alert(`Upload image for ${place.name}`)}
>
  Upload Image
</button>
                </div>
      );
    })}
    </div>
  );
}