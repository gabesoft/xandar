# This file has been generated by node2nix 1.1.1. Do not edit!

{pkgs ? import <nixpkgs> {
    inherit system;
  }, system ? builtins.currentSystem, nodejs ? pkgs."nodejs"}:

let
  nodeEnv = import ./node-env.nix {
    inherit (pkgs) stdenv python utillinux runCommand writeTextFile;
    inherit nodejs;
  };
in
import ./node-packages.nix {
  inherit (pkgs) fetchurl fetchgit;
  inherit nodeEnv;
}
