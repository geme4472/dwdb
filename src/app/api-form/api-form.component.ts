import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-api-form',
  templateUrl: './api-form.component.html',
  styleUrls: ['./api-form.component.css']
})
export class ApiFormComponent implements OnInit {
  apiForm = this.fb.group({
    dbID: [''],
    series: [''],
    color: [''],
    pieces: [''],
    configuration: [''],
    style: [''],
    price: ['']
  })
  

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(){
    //Get ID
    var endpoint = this.router.url
    var dbID = endpoint.replace('/form/', '')
    //If ID, set values
    if(dbID){ this.formSetValues(dbID) }
  }

  formSetValues(dbID){
    var url = 'http://127.0.0.1:8081/api/v1.1/drum/query?op=findOne&dbID=' + dbID
    this.http.get<any>(url).subscribe(data => {
      if(data){
        //console.log(data); console.log(this.apiForm.controls)
        this.apiForm.controls['dbID'].setValue(data._id)
        this.apiForm.controls['series'].setValue(data.series)
        this.apiForm.controls['color'].setValue(data.color)
        this.apiForm.controls['pieces'].setValue(data.pieces)
        this.apiForm.controls['configuration'].setValue(data.configuration)
        this.apiForm.controls['style'].setValue(data.style)
        this.apiForm.controls['price'].setValue(data.price)
      }
    })    
  }

  onSubmit() {
    const headers = { 'Access-Control-Allow-Origin': '*', responseType: 'text' }
    var postParms 
    var endpoint
    var bodyJson

    endpoint = this.apiForm.value.dbID ? 'update?' : 'add?'
    
    postParms = 'dbID='+this.apiForm.value.dbID
    if(this.apiForm.value.series){ postParms += '&series='+this.apiForm.value.series }
    if(this.apiForm.value.color){ postParms += '&color='+this.apiForm.value.color }
    if(this.apiForm.value.pieces){ postParms += '&pieces='+this.apiForm.value.pieces }
    if(this.apiForm.value.configuration){ postParms += '&configuration='+this.apiForm.value.configuration }
    if(this.apiForm.value.style){ postParms += '&style='+this.apiForm.value.style }
    if(this.apiForm.value.price){ postParms += '&price='+this.apiForm.value.price }

    bodyJson = { dbID:this.apiForm.value.dbID, series: this.apiForm.value.series, color: this.apiForm.value.color }
    bodyJson = postParms

    var url = 'http://127.0.0.1:8081/api/v1.1/drum/' + endpoint + postParms

    // Simple POST request with response type <any>
    this.http.post<any>(url, bodyJson,  { headers }).subscribe(data => { 
      this.router.navigateByUrl('/')
    })
  }
}
