import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomBanner from "./CustomBanner";
import { describe, it, expect, beforeEach, vi } from "vitest";


// Mock files for testing
const mockImageFile = new File(['image content'], 'image.png', { type: 'image/png' });
const mockLargeFile = new File(['large content'.repeat(10000)], 'large.png', { type: 'image/png' });
const mockTextFile = new File(['text content'], 'file.txt', { type: 'text/plain' });


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
      render(<CustomBanner />);
      expect(screen.getByTestId('ads-banner-container')).toBeInTheDocument();
    });

    it("displays the 'Customize Your Banner' heading", () => {
      render(<CustomBanner />);
      const heading = screen.getByRole("heading", { name: /Customize Your Banner/i });
      expect(heading).toBeVisible();
    });



    it("renders all 7 form labels correctly", () => {
      render(<CustomBanner />);
      expect(screen.getByLabelText("Background color")).toBeInTheDocument();
      expect(screen.getByLabelText("Text color")).toBeInTheDocument();
      expect(screen.getByLabelText("Headline")).toBeInTheDocument();
      expect(screen.getByLabelText("Copy Text")).toBeInTheDocument();
      expect(screen.getByLabelText("CTA Button Text")).toBeInTheDocument();
    });


    it("displays correct placeholder texts", () => {
      render(<CustomBanner />);
      expect(screen.getByPlaceholderText(/Enter your headline/i)).toBeVisible();
      expect(screen.getByPlaceholderText(/Enter your copy text/i)).toBeVisible();
      expect(screen.getByPlaceholderText(/Enter your CTA button text/i)).toBeVisible();
    });
  });



  // 2. Banner Content Tests
  describe("Banner Content", () => {
    it("displays default banner text content", () => {
      render(<CustomBanner />);
      expect(screen.getByText("Wiki Loves Africa")).toBeInTheDocument();
      expect(screen.getByText("Easter is here - show someone much love")).toBeInTheDocument();
      expect(screen.getByText("Sign up")).toBeInTheDocument();
    });


    // handle change in headline content

    it("updates banner text when form inputs change", async () => {
      render(<CustomBanner />);
      const headlineInput = screen.getByLabelText("Headline");
      await userEvent.clear(headlineInput);
      await userEvent.type(headlineInput, "New Headline");
      expect(screen.getByText("New Headline")).toBeInTheDocument();
    });

    // handle changes in copycontent 
    it("updates banner text when form inputs change", async () => {
      render(<CustomBanner />);
      const CopyInput = screen.getByLabelText("Copy Text");
      await userEvent.clear(CopyInput);
      await userEvent.type(CopyInput, "New CopyInput");
      expect(screen.getByText("New CopyInput")).toBeInTheDocument();
    });

  });


  // 3. File Upload Tests
  
  
  // 4. Style and Interaction Tests
  describe("Style and Interactions", () => {
    it("updates banner style when color pickers change", () => {
      render(<CustomBanner />);
      const bgColorInput = screen.getByLabelText("Background color");
      fireEvent.input(bgColorInput, { target: { value: '#ff0000' } });
      
      const banner = screen.getByTestId('ads-banner-container');
      expect(banner).toHaveStyle('background-color: #ff0000');
    });
  });


  // 5. handle when close button is clicked
  describe('Banner Close Button', () => {
    it('hides the banner when close button is clicked', async () => {
      render(<CustomBanner />);
      const closeButton = screen.getByRole('button', { name: /close banner/i });
      const banner = screen.getByTestId('ads-banner-container');
      expect(banner).toBeInTheDocument();
      await userEvent.click(closeButton);
      expect(screen.queryByTestId('ads-banner-container')).not.toBeInTheDocument();
    });
  
    it('has proper accessibility attributes', () => {
      render(<CustomBanner />);
      const closeButton = screen.getByRole('button', { name: /close banner/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close banner');
      
      // Verify tooltip is properly marked as inert
      const tooltip = screen.getByText('Hide');
      expect(tooltip).toHaveAttribute('inert');
      expect(tooltip).toHaveAttribute('role', 'tooltip');
    });
  
    it('closes when pressing Enter key', async () => {
      render(<CustomBanner />);
      
      const closeButton = screen.getByRole('button', { name: /close banner/i });
      closeButton.focus();
      expect(screen.getByTestId('ads-banner-container')).toBeInTheDocument();
      await userEvent.keyboard('{Enter}');
    
      expect(screen.queryByTestId('ads-banner-container')).not.toBeInTheDocument();
    });
  });



  // 6 Persistence Tests
  describe("Persistence", () => {
    it("loads persisted state from localStorage", () => {
      localStorage.setItem('bannerCopy', JSON.stringify({
        headline: 'Persisted Headline',
        copyText: 'Persisted Copy',
        ctaBtnText: 'Persisted CTA'
      }));
      
      render(<CustomBanner />);
      expect(screen.getByText("Persisted Headline")).toBeInTheDocument();
    });
  });
});