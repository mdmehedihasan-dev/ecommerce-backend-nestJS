import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/catagory.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {

   constructor(
       @InjectRepository(Category)
       private readonly categoryRepository: Repository<Category>,
      //  @InjectRepository(Product)
      //  private readonly userRepository: Repository<User>,
     ) {}


    /*<========================================>
           🏳️   Create Category Start    🏳️
    ===========================================>*/ 
    async createCategory(createCategoryDto: CreateCategoryDto, ownerId: number): Promise<Category> {

      const { categoryName, categoryDescription } = createCategoryDto;

     
      const existing = await this.categoryRepository.findOne({ where: { categoryName } });
      if (existing) {
          throw new ConflictException('Category with this name already exists');
        }


      const category = this.categoryRepository.create({
        categoryName,
        ownerId,
        categoryDescription,
      });

      return await this.categoryRepository.save(category);
    }
    /*<========================================>
       🚩       Create Category End        🚩
    ===========================================>*/
    /*<========================================>
           🏳️   Update Category Start    🏳️
    ===========================================>*/
    async updateCategory(
        id: number, 
        updateCategoryDto: CreateCategoryDto, 
        ownerId: number):Promise<any> {
      
      const category = await this.categoryRepository.findOne({ where: { id } });

      console.log(category)

      if (!category) {
          throw new NotFoundException('Category not found');

      }

      if( category.ownerId !== ownerId) {
          throw new ForbiddenException('Access denied. Only owner can update.'); 
      }

      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    }
    /*<========================================>
       🚩       Update Category End        🚩
    ===========================================>*/
    /*<========================================>
           🏳️   Delete Category Start    🏳️
    ===========================================>*/
    async deleteCategory(id: number, ownerId: number): Promise<{ message: string }> {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }
          if (category.ownerId !== ownerId) {
              throw new ForbiddenException('Access denied. Only owner can delete.');
          } 

        await this.categoryRepository.remove(category);

            return { message: 'Category deleted successfully',}
          }
        /*<========================================>
           🚩       Delete Category End        🚩
        ===========================================>*/
        /*<========================================>
               🏳️   Get All Categories Start    🏳️
        ===========================================>*/
    
        async getAllCategory(ownerId: number): Promise<Category[]> {
    
            const categories = await this.categoryRepository.find({ where: { ownerId } });
    
            if (!categories || categories.length === 0) {
                throw new NotFoundException('No categories found for this user');
            }
    
            return categories;
        }
        
    
        /*<========================================>
           🚩       Get All Categories End        🚩
        ===========================================>*/
        /*<========================================>
               🏳️   Get Category By ID Start    🏳️
        ===========================================>*/
        async getCategoryById(id: number, ownerId: number): Promise<Category> {
            const category = await this.categoryRepository.findOne({ where: { id } });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            if (category.ownerId !== ownerId) {
                throw new ForbiddenException('Access denied. Only owner can view.');
            }

            return category;
        }
        /*<========================================>
          🚩       Get Category By ID End        🚩
        ===========================================>*/

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
}
