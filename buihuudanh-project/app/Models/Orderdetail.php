<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $table = 'cdtt_orderdetail'; // Specify the table name

    protected $fillable = [
        'order_id',
        'product_id',
        'price',
        'qty',
        'discount',
        'amount',
    ]; // Add all the fields you want to be mass-assignable

    public $timestamps = false; // Disable timestamps
}