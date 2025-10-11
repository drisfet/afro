{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.postgresql
    pkgs.go
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
    pkgs.openssl
    pkgs.gcc
    pkgs.gnumake
    pkgs.pkg-config
    pkgs.dnsutils
    pkgs.zip
  ];
  env = {};
  idx = {
    extensions = [
      "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "kilocode.kilo-code"
    ];
    previews = {
      enable = true;
      previews = {
        combined = {
          command = ["./start-dev.sh"];
          manager = "web";
          cwd = ".";
        };
      };
    };
    workspace = {
      onCreate = {};
      onStart = {};
    };
  };
}
