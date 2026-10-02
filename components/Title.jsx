



export default function Title({title1, title2, titleStyles, paraStyles, para}) {
  
  return(
    <>
      <div className={`${titleStyles}`}>
        <h3 className={`${titleStyles} h3`}>
          {title1}
          <span className="text-destructive font-light! underline">{title2}</span>
        </h3>
        <p className={`${paraStyles} max-w-md`}>
          {para ? para : "Explore our collection of stylish clothing and footwear made for comfort, quality, and everyday confidence."}
        </p>
      </div>
    </>
  );
}