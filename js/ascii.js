// Bold the root and each state name. Place lines stay regular weight.
// State names sit on a depth-1 branch (├── or └── at column 0), so only the label is bold.
function renderBranch(id, text) {
  const pre = document.getElementById(id);
  pre.textContent = "";
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const stateBranch = line.match(/^(├── |└── )(.+)$/);
    const isRoot = line.trim() !== "" && !/^[\s├└│─]/.test(line);
    if (isRoot) {
      const strong = document.createElement("strong");
      strong.textContent = line;
      pre.appendChild(strong);
    } else if (stateBranch) {
      pre.appendChild(document.createTextNode(stateBranch[1]));
      const strong = document.createElement("strong");
      strong.textContent = stateBranch[2];
      pre.appendChild(strong);
    } else {
      pre.appendChild(document.createTextNode(line));
    }
    if (index < lines.length - 1) {
      pre.appendChild(document.createTextNode("\n"));
    }
  });
}

// Load desktop ASCII art
fetch("assets/ascii/tree-desktop.txt")
  .then((response) => response.text())
  .then((data) => renderBranch("ascii-tree-desktop", data))
  .catch((error) => console.error("Error loading desktop ASCII tree:", error));

// Load mobile ASCII tree
fetch("assets/ascii/tree-mobile.txt")
  .then((response) => response.text())
  .then((data) => renderBranch("ascii-tree-mobile", data))
  .catch((error) => console.error("Error loading mobile ASCII art:", error));
