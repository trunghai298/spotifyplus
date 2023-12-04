function Container(props: React.PropsWithChildren) {
  return (
    <div className="h-full px-4 py-4 sm:px-16 md:px-24 lg:px-32 xl:px-64">
      {props.children}
    </div>
  );
}

export default Container;
