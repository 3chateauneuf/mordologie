#!/usr/bin/env python3
"""Simple queue manager for Yumi BL PDFs.

Keeps the working folder clean by treating top-level PDFs as pending files and
moving completed ones into a dedicated `processed/` folder.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


DEFAULT_ROOT = Path("/Users/ed/Downloads/BL-YUMI")
PROCESSED_DIRNAME = "processed"


def pending_pdfs(root: Path) -> list[Path]:
    return sorted(path for path in root.glob("*.pdf") if path.is_file())


def processed_pdfs(root: Path) -> list[Path]:
    processed_dir = root / PROCESSED_DIRNAME
    if not processed_dir.exists():
        return []
    return sorted(path for path in processed_dir.glob("*.pdf") if path.is_file())


def ensure_processed_dir(root: Path) -> Path:
    processed_dir = root / PROCESSED_DIRNAME
    processed_dir.mkdir(parents=True, exist_ok=True)
    return processed_dir


def unique_destination(processed_dir: Path, filename: str) -> Path:
    destination = processed_dir / filename
    if not destination.exists():
        return destination

    stem = destination.stem
    suffix = destination.suffix
    counter = 2
    while True:
        candidate = processed_dir / f"{stem} ({counter}){suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def archive_files(root: Path, file_names: list[str]) -> list[tuple[Path, Path]]:
    processed_dir = ensure_processed_dir(root)
    moved: list[tuple[Path, Path]] = []
    for name in file_names:
        source = root / name
        if not source.exists():
            raise FileNotFoundError(f"Missing file: {source}")
        if not source.is_file():
            raise ValueError(f"Not a file: {source}")
        destination = unique_destination(processed_dir, source.name)
        shutil.move(str(source), str(destination))
        moved.append((source, destination))
    return moved


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Manage pending vs processed Yumi BL PDFs."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=DEFAULT_ROOT,
        help=f"BL root folder (default: {DEFAULT_ROOT})",
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("pending", help="List PDFs still pending at the root.")
    subparsers.add_parser("stats", help="Show pending/processed counts.")

    archive_parser = subparsers.add_parser(
        "archive",
        help="Move the given filenames from the root into processed/.",
    )
    archive_parser.add_argument("files", nargs="+", help="PDF filenames to archive.")

    return parser


def cmd_pending(root: Path) -> int:
    files = pending_pdfs(root)
    for path in files:
        print(path.name)
    print(f"\nPending: {len(files)}")
    return 0


def cmd_stats(root: Path) -> int:
    pending = pending_pdfs(root)
    processed = processed_pdfs(root)
    print(f"Root: {root}")
    print(f"Pending PDFs: {len(pending)}")
    print(f"Processed PDFs: {len(processed)}")
    return 0


def cmd_archive(root: Path, files: list[str]) -> int:
    moved = archive_files(root, files)
    for source, destination in moved:
        print(f"{source.name} -> {destination}")
    print(f"\nArchived: {len(moved)}")
    return 0


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    root = args.root.expanduser().resolve()

    if not root.exists():
        parser.error(f"Root folder does not exist: {root}")

    if args.command == "pending":
        return cmd_pending(root)
    if args.command == "stats":
        return cmd_stats(root)
    if args.command == "archive":
        return cmd_archive(root, args.files)

    parser.error(f"Unknown command: {args.command}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
