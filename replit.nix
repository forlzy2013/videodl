{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
  ];
  env = {
    NODE_ENV = "production";
  };
}
