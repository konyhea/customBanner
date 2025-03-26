import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock FileReader
class MockFileReader {
  result = null;
  onload = vi.fn();
  readAsDataURL() {
    this.result = 'data:image/mock;base64,abc123';
    this.onload();
  }
}

global.FileReader = MockFileReader;

// Mock Cloudinary upload
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ url: 'https://cloudinary.com/mock-image.jpg' }),
  })
);

describe("Banner Component Tests", () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. Form Container Tests
  describe("Form Container", () => {
    it("renders correctly", () => {
      render(<App />);
      expect(screen.getByTestId('ads-banner-container')).toBeInTheDocument();
    });

    it("displays the 'Customize Your Banner' heading", () => {
      render(<App />);
      const heading = screen.getByRole("heading", { name: /Customize Your Banner/i });
      expect(heading).toBeVisible();
    });

    it("renders all 7 form labels correctly", () => {
      render(<App />);
      expect(screen.getByLabelText("Background color")).toBeInTheDocument();
      expect(screen.getByLabelText("Text color")).toBeInTheDocument();
      expect(screen.getByLabelText("Headline")).toBeInTheDocument();
      expect(screen.getByLabelText("Copy Text")).toBeInTheDocument();
      expect(screen.getByLabelText("CTA Button Text")).toBeInTheDocument();
      expect(screen.getByLabelText(/Upload Logo/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Upload Banner Image")).toBeInTheDocument();
    });

    it("displays correct placeholder texts", () => {
      render(<App />);
      expect(screen.getByPlaceholderText(/Enter your headline/i)).toBeVisible();
      expect(screen.getByPlaceholderText(/Enter your copy text/i)).toBeVisible();
      expect(screen.getByPlaceholderText(/Enter your CTA button text/i)).toBeVisible();
    });
  });

  // 2. Banner Content Tests
  describe("Banner Content", () => {
    it("displays default banner text content", () => {
      render(<App />);
      expect(screen.getByText("The best Gift is here")).toBeInTheDocument();
      expect(screen.getByText("The best is here")).toBeInTheDocument();
      expect(screen.getByText("Click Here")).toBeInTheDocument();
    });

    it("updates banner text when form inputs change", async () => {
      render(<App />);
      const headlineInput = screen.getByLabelText("Headline");
      await userEvent.clear(headlineInput);
      await userEvent.type(headlineInput, "New Headline");
      expect(screen.getByText("New Headline")).toBeInTheDocument();
    });
  });

  // 3. File Upload Tests
  describe("File Upload Functionality", () => {
    it("handles logo file upload", async () => {
      render(<App />);
      const file = new File(["logo"], "logo.png", { type: "image/png" });
      
      const dropzone = screen.getByText("Drag & drop a logo");
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
          types: ['Files']
        }
      });

      await waitFor(() => {
        expect(screen.getByAltText("selected file")).toBeInTheDocument();
      });
      
      const uploadBtn = screen.getByText("Upload");
      await userEvent.click(uploadBtn);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });

    it("handles banner image upload", async () => {
      render(<App />);
      const file = new File(["banner"], "banner.png", { type: "image/png" });
      
      const dropzone = screen.getByText("Drag & drop a banner image");
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
          types: ['Files']
        }
      });

      await waitFor(() => {
        expect(screen.getByAltText("selected file")).toBeInTheDocument();
      });
      
      const uploadBtn = screen.getByText("Upload");
      await userEvent.click(uploadBtn);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });

    it("removes uploaded logo when remove button is clicked", async () => {
      localStorage.setItem('logoDataURL', 'data:image/mock;base64,abc123');
      render(<App />);
      
      const removeBtn = screen.getByText("Remove");
      await userEvent.click(removeBtn);
      
      expect(screen.queryByAltText("selected file")).not.toBeInTheDocument();
    });
  });

  // 4. Style and Interaction Tests
  describe("Style and Interactions", () => {
    it("updates banner style when color pickers change", () => {
      render(<App />);
      const bgColorInput = screen.getByLabelText("Background color");
      fireEvent.input(bgColorInput, { target: { value: '#ff0000' } });
      
      const banner = screen.getByTestId('ads-banner-container');
      expect(banner).toHaveStyle('background-color: #ff0000');
    });

    it("hides the banner when close button is clicked", async () => {
      render(<App />);
      const closeBtn = screen.getByLabelText("close");
      await userEvent.click(closeBtn);
      expect(screen.queryByTestId('ads-banner-container')).not.toBeInTheDocument();
    });
  });

  // 5. Persistence Tests
  describe("Persistence", () => {
    it("loads persisted state from localStorage", () => {
      localStorage.setItem('bannerCopy', JSON.stringify({
        headline: 'Persisted Headline',
        copyText: 'Persisted Copy',
        ctaBtnText: 'Persisted CTA'
      }));
      
      render(<App />);
      expect(screen.getByText("Persisted Headline")).toBeInTheDocument();
    });
  });
});