import Skeleton from "../Skeleton/Skeleton";

export default function PostItemSkeleton() {
  return (
    <li className="post-item">
      <div className="post-item__wrapper">
        <div className="post-item__head">
          <Skeleton width="100%" height="40px" radius="6px"></Skeleton>
        </div>
        <div className="post-item__content">
          <Skeleton width="100%" height="60px" radius="6px"></Skeleton>
          <br />
          <Skeleton width="100%" height="200px" radius="6px"></Skeleton>
        </div>
      </div>
    </li>
  );
}
