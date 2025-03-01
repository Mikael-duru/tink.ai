"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/data/testimonial";

const TestimonialSlider = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: false,
		responsive: [
			{
				breakpoint: 1023,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 610,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
			<div className="container mx-auto px-4 md:px-6">
				<h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
					What our Users say
				</h2>
				<Slider {...settings} className="max-w-6xl mx-auto">
					{testimonials.map((testimonial, index) => (
						<div key={index} className="px-4">
							<Card className="bg-background">
								<CardContent className="pt-6 h-[250px]">
									<div className="flex flex-col gap-8 justify-between">
										<div className="flex items-center space-x-3 pb-2">
											<div className="relative size-12 flex-shrink-0">
												<Image
													src={testimonial.image}
													alt={testimonial.author}
													width={40}
													height={40}
													className="rounded-full object-cover border-2 border-primary/20"
												/>
											</div>
											<div>
												<p className="font-semibold">{testimonial.author}</p>
												<p className="text-sm text-muted-foreground">
													{testimonial.role}
												</p>
												<p className="text-sm text-primary">
													{testimonial.company}
												</p>
											</div>
										</div>
										<blockquote className="flex-1">
											<p className="text-muted-foreground italic relative text-sm">
												<span className="text-3xl text-primary absolute -top-4 -left-2">
													&quot;
												</span>
												{testimonial.quote}
												<span className="text-3xl text-primary absolute -bottom-4">
													&quot;
												</span>
											</p>
										</blockquote>
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</Slider>
			</div>
		</section>
	);
};

export default TestimonialSlider;
