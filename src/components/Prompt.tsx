import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Prompt() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(
    window.location.href.split("/")[3] || "home"
  );
  const [isEditing, setIsEditing] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Adjust this value as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (inputRef.current && !isSmallScreen) {
      inputRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isSmallScreen]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleFocus = () => {
    if (!isSmallScreen) {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e) => {
    if (isSmallScreen) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target.textContent.trim().toLowerCase();
      if (
        ["home", "about", "projects", "socials", "blog", "gallery"].includes(
          input
        )
      ) {
        navigate(`/${input === "home" ? "" : input}`);
        setCurrentPage(input);
      } else {
        e.target.textContent = currentPage;
      }
      setIsEditing(false);
    }
  };

  return (
    <span className="text-prim glow px-4 py-2.5 text-xl space-x-2 select-none flex">
      <span className="text-slate-100">$</span>
      <span>winit</span>
      <div
        ref={inputRef}
        className="focus:outline-none"
        contentEditable={!isSmallScreen}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {currentPage}
      </div>
    </span>
  );
}
