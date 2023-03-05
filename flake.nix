{
  description = "Node Development environment";

  inputs = {
    nixpkgs = { url = "github:NixOS/nixpkgs/nixpkgs-unstable"; };
    flake-utils = { url = "github:numtide/flake-utils"; };
  };

  outputs = { self, nixpkgs, flake-utils, ... } :
    flake-utils.lib.eachDefaultSystem (system:
      let
        inherit system;
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs-18_x
            nodePackages.typescript
            nodePackages.typescript-language-server
            nodePackages.pnpm
            esbuild
          ];
        };
      });
}
