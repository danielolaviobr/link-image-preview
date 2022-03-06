import React from "react";
import Spinner from "./Spinner";

interface Props {
  href: string;
  children: React.ReactNode;
  alt?: string;
  image: string | Promise<string>;
  isBase64?: boolean;
  [key: string]: any;
}

export default function CustomLink({
  href,
  alt,
  children,
  image,
  isBase64 = false,
  ...others
}: Props) {
  let [showPreview, setShowPreview] = React.useState(false);
  let [imagePreview, setImagePreview] = React.useState("");
  let inImagePreview = false;
  let inLink = false;

  let handleMouseEnterImage = () => {
    inImagePreview = true;
    setShowPreview(true);
  };

  let handleMouseLeaveImage = () => {
    inImagePreview = false;
    setShowPreview(inLink);
  };

  let handleMouseEnterLink = () => {
    inLink = true;
    setShowPreview(true);
  };

  let handleMouseLeaveLink = () => {
    inLink = false;
    setShowPreview(inImagePreview);
  };

  let handleAwaitPromise = async (image: string | Promise<string>) => {
    let resolved = await image;
    setImagePreview(resolved);
  };

  React.useEffect(() => {
    handleAwaitPromise(image);

    return () => setImagePreview("");
  }, [image]);

  return (
    <span id="container">
      <a
        href={href}
        id={`${showPreview && "underline"}`}
        onMouseEnter={handleMouseEnterLink}
        onMouseLeave={handleMouseLeaveLink}
        onFocus={handleMouseEnterLink}
        onBlur={handleMouseLeaveLink}
        {...others}>
        {children}
      </a>
      {showPreview && (
        <a href={href} {...others}>
          <span
            onMouseLeave={handleMouseLeaveImage}
            onMouseEnter={handleMouseEnterImage}
            onFocus={handleMouseEnterImage}
            onBlur={handleMouseLeaveImage}
            id="image-container">
            {imagePreview ? (
              <img
                width={144}
                height={96}
                alt={alt || href}
                id="image"
                src={`${isBase64 && "data:image/jpeg;base64,"} ${imagePreview}`}
              />
            ) : (
              <span id="image-placeholder">
                <Spinner />
              </span>
            )}
          </span>
        </a>
      )}
    </span>
  );
}
