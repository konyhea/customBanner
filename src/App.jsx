import { useState, useEffect } from "react";
import "./App.css";
import Close from "./assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Arrow from "./assets/arrow_forward_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

function App() {
  const [display, setDisplay] = useState(true);
  
  const [bannerStyle, setBannerStyle] = useState(() => {
    const savedBannerStyle = localStorage.getItem('bannerStyle');
    return savedBannerStyle && savedBannerStyle !== "null"
    ? JSON.parse(savedBannerStyle)
    : {
      backgroundColor: 'white',
      color: 'black'
    };
  });


  const [bannerCopy, setBannerCopy] = useState(() => {
    const savedBannerCopy = localStorage.getItem('bannerCopy');
    return savedBannerCopy && savedBannerCopy !== "null"
    ? JSON.parse(savedBannerCopy)
    : {
      headline: "The best Gift is here",
      copyText: "The best is here",
      ctaBtnText: "Click Here"
    };
  });


  const [logo, setLogo] = useState(() => {
    const savedLogo = localStorage.getItem('logo');
    return savedLogo || null; // Load saved logo URL or default to null
});

const [bannerImage, setBannerImage] = useState(() => {
    const savedBannerImage = localStorage.getItem('bannerImage');
    return savedBannerImage || null; // Load saved banner image URL or default to null
});


  useEffect(() => {
    localStorage.setItem('bannerCopy', JSON.stringify(bannerCopy))
  }, [bannerCopy]);


  useEffect(() => {
    localStorage.setItem('bannerStyle', JSON.stringify(bannerStyle))
  }, [bannerStyle]);

      // Save logo URL to localStorage whenever it changes
      useEffect(() => {
        if (logo) {
            localStorage.setItem('logo', logo);
        } else {
            localStorage.removeItem('logo'); // Remove the logo key if logo is null
        }
    }, [logo]);

    // Save banner image URL to localStorage whenever it changes
    useEffect(() => {
        if (bannerImage) {
            localStorage.setItem('bannerImage', bannerImage);
        } else {
            localStorage.removeItem('bannerImage'); // Remove the banner image key if bannerImage is null
        }
    }, [bannerImage]);


  const handleCopy = (e) => {
    const {name, value} = e.target;
    setBannerCopy((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBannerStyle = (e) => {
    const {name, value} = e.target;
    setBannerStyle((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file); // Create a URL for the uploaded file
        setLogo(fileURL); // Update the logo state with the file URL
    }
};

// Handler for banner image upload
const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file); // Create a URL for the uploaded file
        setBannerImage(fileURL); // Update the banner image state with the file URL
    }
};

  return (
    
    <div className="banner-container">
      {display && (
        <div className="ads-banner-container"
          style={{
            backgroundColor: bannerStyle.backgroundColor,
            color: bannerStyle.color
          }}
        >
          <div className="ads-banner-content">
            <div className="ads-banner-logo">
              {
                logo && (
                  <img src={logo} alt="Uploaded Logo" className="logo-preview" />
                )
              }
            </div>
            <div className="ads-banner-image">
              {
                bannerImage && (
                  <img src={bannerImage} alt="Uploaded Banner" className="banner-image-preview" /> 
                )
              }
            </div>
            <div className="ads-banner-text-container">
              <div className="headline-container">
                <h3 className="headine-copy-text">{bannerCopy.headline}</h3>
              </div>
              <div className="copy-text-container">
                <p className="copy-text">{bannerCopy.copyText}</p>
              </div>

              {/* cta */}
              <div className="cta-btn-container">
                <a href="#">
                <button className="cta-btn">
                  <span className="cta-text">{bannerCopy.ctaBtnText}</span>
                  <img src={Arrow} alt="Arrow icon indicating action" />
                </button>
                </a>

              </div>
            </div>
          </div>
          <div className="close-btn-container">
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation(); 
                setDisplay((prev) => !prev);
              }}
              aria-label="close"
            >
              <img src={Close} alt="close" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}



      {/* form for controling the inputs in the banner */}
      <div className="ads-banner-control">
        <div className="form-container">
          <form
            action=""
            aria-labelledby="form-title"
            className="form-container"
          >
            <h2 id="form-title">Customize Your Banner</h2>
            <fieldset>
              <label
                htmlFor="backgroundColor"
                className="banner-backgroundColor-change"
              >
                Background color
              </label>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={bannerStyle.backgroundColor}
                onChange={handleBannerStyle}
                className="backgroundColor-input"
                aria-label="Background color picker"
                // aria-describedby="backgroundColor-description"
              />
              {/* <p id="backgroundColor-description">
                Choose a color for the background.
              </p> */}

              <label htmlFor="color" className="banner-color-change">
                Text color
              </label>
              <input
                type="color"
                id="color"
                name="color"
                value={bannerStyle.color}
                onChange={handleBannerStyle}
                className="color-input"
                aria-label="Color picker"
                // aria-describedby="textColor-description"
              />
              {/* <p id="textColor-description">Choose a color for the text.</p> */}

              
              <label
                htmlFor="headingText"
                className="banner-heading-text-change"
              >
                Headline
              </label>
              <input
                type="text"
                id="headingText"
                name="headline"
                value={bannerCopy.headline}
                onChange={handleCopy}
                className="heading-text-input"
                placeholder="Enter your headline"
                required
                aria-label="Heading Text"
                // aria-describedby="headingText-description"
              />
              {/* <p id="headingText-description">
                Enter the heading text for your banner.
              </p> */}

              <label
                htmlFor="subtitleText"
                className="banner-subtitle-text-change"
              >
                Copy Text
              </label>
              <input
                type="text"
                id="subtitleText"
                name="copyText"
                value={bannerCopy.copyText}
                onChange={handleCopy}
                className="subtitle-text-input"
                placeholder="Enter your copy text"
                aria-label="Copy text"
                // aria-describedby="subtitleText-description"
              />
              {/* <p id="subtitleText-description">
                Enter the subtitle text for your banner.
              </p> */}

              <label
                htmlFor="ctaBtnText"
                className="banner-cta-btn-text-change"
              >
                CTA Button Text
              </label>
              <input
                type="text"
                id="ctaBtnText"
                name="ctaBtnText"
                value={bannerCopy.ctaBtnText}
                onChange={handleCopy}
                className="cta-btn-text-input"
                placeholder="Enter your CTA button text"
                aria-label="CTA button"
                // aria-describedby="ctaBtnText-description"
              />
              {/* <p id="ctaBtnText-description">
                Enter the text for the CTA button.
              </p> */}

              <label htmlFor="logo" className="banner-logo-upload">
                Upload Logo
              </label>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="custom-file-input"
                aria-label="File upload"
                // aria-describedby="logo-description"
              />
              {/* <p id="logo-description">
                Upload your logo image (PNG, JPEG, etc.).
              </p> */}

              <label htmlFor="bannerImage" className="banner-image-upload">
                Upload Banner Image
              </label>
              <input
                type="file"
                id="bannerImage"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="custom-file-input"
                aria-label="File upload"
                // aria-describedby="bannerImage-description"
              />
              {/* <p id="bannerImage-description">
                Upload an image for your banner.
              </p> */}
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
