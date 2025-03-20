import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  standalone: false,
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent  implements OnInit {

  public heroForm = new FormGroup({
    id:         new FormControl<string>(''),
    superhero:  new FormControl<string>('', { nonNullable: true }),
    publisher:  new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:  new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img:    new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) {
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),

    ).subscribe( hero => {
      if ( !hero ) {
        return this.router.navigateByUrl('/heroes');
      }
      this.heroForm.reset( hero );
      return;
    }
    );

  }

  onSubmit() :void{
    if ( this.heroForm.invalid ) {
      this.heroForm.markAllAsTouched();
      return;
    }

    if ( this.currentHero.id ) {
      // Update
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          console.log('Updated', hero);
          this.showSnackBar(`${ hero.superhero } was updated`);
        });

        return;
    }

    //Create
    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        console.log('Created', hero);
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${ hero.superhero } was created`);
      });

    //this.heroesService.updateHero( this.heroForm.value );

  }


  onConfirmDelete(): void {
    if ( !this.currentHero.id ) {
      throw Error('Can not delete a hero without an ID');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero.superhero
    });

    dialogRef.afterClosed()
      .subscribe( (result: boolean) => {
        if ( result ) {
          this.heroesService.deleteHero( this.currentHero.id! )
            .subscribe( wasDeleted => {
              if(wasDeleted){
                this.router.navigate(['/heroes']);
                this.showSnackBar(`${ this.currentHero.superhero } was deleted`);
              }
            });
        }
      });
  }

  showSnackBar( message: string ): void {
    this.snackBar.open( message, 'Ok!', {
      duration: 2500
    });
  }




}
