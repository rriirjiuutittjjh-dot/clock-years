/**
 * Space backdrop: clean themed gradient sky with occasional comet
 * streaks and a vignette. (The parallax star layers were removed.)
 */
export function SpaceBackdrop() {
  return (
    <div className="bd" aria-hidden="true">
      <span className="bd-comet bd-comet-a" />
      <span className="bd-comet bd-comet-b" />
      <div className="bd-vignette" />
    </div>
  );
}
