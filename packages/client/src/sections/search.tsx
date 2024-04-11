import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search"; // Ensure this is imported
import { SearchResult, useGlobalContext } from "..";
import { useNavigate } from "react-router-dom";

function SearchButton({
  handleSearchClick,
}: {
  handleSearchClick: () => void;
}) {
  const ctrl = navigator.platform.includes("Mac") ? "⌘" : "Ctrl";

  return (
    <Button
      startIcon={
        <SearchIcon
          sx={{
            color: "#66f",
          }}
        />
      }
      variant="outlined"
      endIcon={
        <Box
          sx={{
            fontSize: "10px",
            ml: 1,
            borderRadius: "8px",
            border: 1,
            px: 1,
            py: 0,
            backgroundColor: "white",
            marginLeft: "100px",
            borderColor: "lightgray",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            {ctrl}K
          </Typography>
        </Box>
      }
      onClick={handleSearchClick}
      sx={{
        ml: "auto",
        backgroundColor: "#f8f8f8",
        borderRadius: "12px",
        borderColor: "#aaa",
        color: "#555",
        textTransform: "none",
        fontSize: "16px",
      }}
    >
      Search...
    </Button>
  );
}
export function Search() {
  const globalContext = useGlobalContext();

  function handleSearchClick() {
    // Placeholder for what happens when the search button is clicked
    setOpen(true);
    setCurrentIndex(0);
    input.current?.focus();
    input.current?.select();
    setTimeout(() => {
      console.log("focus");
      input.current?.focus();
      input.current?.select();
    }, 100);
  }
  const input = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [currendIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        handleSearchClick();
      } else if (open) {
        console.log("key", event.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigate = useNavigate();
  const filteredPages = useMemo(() => {
    const pages = globalContext.config.pages
      .filter((page: any) =>
        page?.title?.toLowerCase().includes(search.toLowerCase())
      )
      .map((page: any) => {
        const action: SearchResult = {
          label: `Page: ${page.title}`,
          action: () => {
            navigate(page.path);
          },
        };
        return action;
      });
    const customOptions =
      globalContext.config.generateSearchOptions?.(search) || [];
    return [...customOptions, ...pages];
  }, [search, globalContext.config.pages]);

  return (
    <Fragment>
      <SearchButton handleSearchClick={handleSearchClick} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            width: "80%",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle>
          <input
            style={{
              border: "0px",
              outline: "none",
              borderWidth: "0px",
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                setCurrentIndex(
                  Math.min(filteredPages.length - 1, currendIndex + 1)
                );
                e.preventDefault();
              } else if (e.key === "ArrowUp") {
                setCurrentIndex(Math.max(0, currendIndex - 1));
                e.preventDefault();
              } else if (e.key === "Enter") {
                const item = filteredPages[currendIndex];
                item?.action({ navigate, ctx: globalContext });
                setOpen(false);
                setSearch("");
                e.preventDefault();
              }
            }}
            placeholder="Search..."
            autoFocus={true}
            ref={input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </DialogTitle>
        <Divider />
        <Box p={2}>
          {filteredPages.map((item, idx) => (
            <ListItemButton
              key={item.label}
              sx={{
                backgroundColor: currendIndex === idx ? "#f0f0f0" : "white",
              }}
              onClick={() => {
                item.action({ navigate, ctx: globalContext });
                setOpen(false);
                setSearch("");
              }}
            >
              <Typography>{item.label}</Typography>
            </ListItemButton>
          ))}
        </Box>
      </Dialog>
    </Fragment>
  );
}
