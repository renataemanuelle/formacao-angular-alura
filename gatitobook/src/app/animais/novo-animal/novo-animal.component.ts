import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AnimaisService } from '../animais.service';

@Component({
  selector: 'app-novo-animal',
  templateUrl: './novo-animal.component.html',
  styleUrls: ['./novo-animal.component.css'],
})
export class NovoAnimalComponent implements OnInit {
  formularioAnimal!: FormGroup;
  file!: File;
  preview!: string;
  percentualConcluido = 0;

  constructor(
    private animaisService: AnimaisService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formularioAnimal = this.formbuilder.group({
      file: ['', Validators.required],
      description: ['', Validators.maxLength(300)],
      allowComments: [true],
    });
  }

  // tslint:disable-next-line: typedef
  upload() {
    const allowComments =
      this.formularioAnimal.get('allowComments')?.value ?? false;
    const description = this.formularioAnimal.get('description')?.value ?? '';

    this.animaisService
      .upload(description, allowComments, this.file)
      .pipe(finalize(() => this.router.navigate(['animais'])))
      .subscribe(
        // tslint:disable-next-line: no-any
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total ?? 1;
            this.percentualConcluido = Math.round(100 * (event.loaded / total));
          }
        },
        (error) => console.log(error)
      );
  }

  // tslint:disable-next-line: no-any
  gravaArquivo(arquivo: any): void {
    const [file] = arquivo?.files;
    this.file = file;
    const reader = new FileReader();
    // tslint:disable-next-line: no-any
    reader.onload = (event: any) => (this.preview = event.target.result);
    reader.readAsDataURL(file);
  }
}
