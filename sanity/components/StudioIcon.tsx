export function StudioIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 22 px icon in the Studio chrome, not on the public site
    <img
      src="/images/logo-eliane-larre.png"
      alt=""
      width={22}
      height={22}
      style={{
        display: 'block',
        borderRadius: 4,
        objectFit: 'cover',
      }}
    />
  )
}
