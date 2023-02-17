import Link from "next/link";

export default function TooltipMenu({ position, menu, isShow}) {
  return (
    <ul className={`tooltip-menu ${isShow ? "is-show" : ""}`}>
      {menu.map((item, index) => (
        <li key={index} className="tooltip-menu__item">
          {item.link && (
            <Link href={item.link}>
              <span className="tooltip-menu__item--ico">
                <item.Icon></item.Icon>
              </span>
              <span className="tooltip-menu__item--ttl">{item.title}</span>
            </Link>
          )}
          {!item.link && !item.Wrapper && (
            <div className="tooltip-menu__item--wrapper" onClick={item.clickAction}>
              <span className="tooltip-menu__item--ico">
                <item.Icon></item.Icon>
              </span>
              <span className="tooltip-menu__item--ttl">{item.title}</span>
            </div>
          )}
          {!item.link && item.Wrapper && (
            <item.Wrapper {...item.wrapperProps}>
            <div className="tooltip-menu__item--wrapper" onClick={item.clickAction}>
              <span className="tooltip-menu__item--ico">
                <item.Icon></item.Icon>
              </span>
              <span className="tooltip-menu__item--ttl">{item.title}</span>
            </div>
            </item.Wrapper>
          )}
        </li>
      ))}
    </ul>
  );
}
