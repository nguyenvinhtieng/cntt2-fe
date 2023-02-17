function Skeleton({width = "100%", height = "100%", radius = 0, marginBottom = 0}) {
    const styles = {
      width: width, 
      height: height,
      borderRadius: radius,
      marginBottom: marginBottom,
    }
    return (
      <div style={styles} className="skeleton"></div>
    )
  }
  
  export default Skeleton;