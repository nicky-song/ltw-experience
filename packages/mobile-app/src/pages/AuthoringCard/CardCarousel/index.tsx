interface CardCarouselProps {
  currentIndex: number;
  children?: React.ReactNode[];
}

const CardCarousel = ({ children, currentIndex }: CardCarouselProps) => {
  return <>{children?.length ? children[currentIndex] : null}</>;
};

export default CardCarousel;
