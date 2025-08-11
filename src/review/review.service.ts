import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Review } from 'src/entity/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/entity/user.entity';
import { UpdateReviewDto } from './dto/Update-review.dto';


@Injectable()
export class ReviewService {

    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}


    /*<========================================>
      🏳️      create Review Part Start     🏳️
    ===========================================>*/
   async createReview(createReviewDto: CreateReviewDto, userId: number): Promise<any> {
    const { productId , ...reviewData } = createReviewDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['vendor'], // এটিই ভীষণ জরুরি
    });
    if (!product) {
        throw new NotFoundException('Product not found');
    }

    // 🛑 Check: product.vendor থাকবে না (undefined)
    if (product.vendor?.id === user.id) {
         return { message: 'Cannot review your own product' };
    }

    const review = this.reviewRepository.create({
        ...reviewData,
        user,
        product,
    });

    return this.reviewRepository.save(review);

   }

    /*<========================================>
      🚩      create Review Part End       🚩
    ===========================================>*/

    /*<========================================>
      🏳️      Update Review Part Start     🏳️
    ===========================================>*/
    async updateReview(updateReviewDto: UpdateReviewDto, userId: number, reviewId: number): Promise<any> {
        
    
          const user = await this.userRepository.findOne({ where: { id: userId } });
          if (!user) {
                throw new NotFoundException('User not found');
          }
    
          const review = await this.reviewRepository.findOne({
                where: { id: reviewId },
                relations: ['user'],
          });


          if(review?.user?.id !== userId ){
             return { message: 'Cannot review your own product' };
          }
          
          Object.assign(review,updateReviewDto);

          const updated = await this.reviewRepository.save(review);

           return {
                message: 'Store updated successfully',
                store: updated,
            };

     }
     /*<========================================>
       🚩      Update Review Part End      🚩
    ===========================================>*/
     /*<========================================>
      🏳️      Delete Review Part Start     🏳️
    ===========================================>*/
   
    async deleteReview(reviewId: number, userId: number): Promise<any> {

        console.log(userId)

        const review = await this.reviewRepository.findOne({
            where: { id: reviewId },
            relations: ['user'],
        });

        

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        
        if (review?.user?.id !== userId) {
            return { message: 'You can only delete your own review' };
        }

        await this.reviewRepository.remove(review);

        return { message: 'Review deleted successfully' };
    }
    /*<========================================>
      🚩     Delete Review Part End      🚩
    ===========================================>*/

    /*<========================================>
       🏳️   Get All Review Start    🏳️
    ===========================================>*/

    async allReview(): Promise<any[]> {

        const reviews = await this.reviewRepository.find({
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' }, 
        });

        if (!reviews || reviews.length === 0) {
            throw new NotFoundException('No reviews found');
        }

        return reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
        }));


    }
     /*<========================================>
         🚩     Delete All Review End     🚩
    ===========================================>*/






}
