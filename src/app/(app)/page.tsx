'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import msgs from '@/data/msgs.json'
import AutoPlay from 'embla-carousel-autoplay'

const Home = () => (
  <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:px-24">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Welcome to the world of anonymity
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Start Exploring: Where your identity is never revealed
        </p>
      </section>
      <Carousel
        plugins={[AutoPlay({ delay: 1000 })]}
        className='w-full max-w-xs'
      >
        <CarouselContent>
          {msgs.map(({ content, received, title }, i) => (
            <CarouselItem key={i}>
              <div className="p-1">
                <Card>
                  <CardHeader>
                    {title}
                  </CardHeader>
                  <CardContent className='flex aspect-square justify-center p-6'>
                    <span className="text-lg font-semibold">
                      {content}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer className='text-center p-4 md:p-6'>
      &copy; 2024 Anonymous Messaging | All Rights Reserved.
    </footer>
  </>
)

export default Home