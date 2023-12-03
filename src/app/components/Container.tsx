function Container(props: React.PropsWithChildren) {
  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-24 lg:py-10">
      {props.children}
    </div>
  );
}

export default Container;
