<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;


class UserController extends Controller
{
    // Register a new user
    public function register(StoreUserRequest $request)
{
    $user=new User();
        $user->name=$request->name;
        $user->phone=$request->phone;
        $user->email=$request->email;
        $user->address=$request->address;
        $user->gender=$request->gender;
        $user->password=bcrypt($request->password);
        $user->username=$request->username;
        $user->roles='customer';
        $user->created_at=date('Y-m-d H:i:s');
        $user->created_by = Auth::id()?? 1;
        $user->status = '1';
        $user->save();

    return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
}

    // Login a user
    public function login(Request $request)
{
    $user = User::where([['username', $request->username], ['status','=',1]])->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json(['message' => 'Login successful', 'token' => $token, 'user' => $user], 200);
}

    // Logout the user
    public function logout(Request $request)
{
    $user = auth()->user();

    // Check if user is authenticated
    if ($user) {
        $user->currentAccessToken()->delete();
        return response()->json(['message' => 'User logged out successfully.'], 200);
    }

    // If user is not authenticated
    return response()->json(['error' => 'No authenticated user found.'], 401);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
{
    $user = User::find($id);
    if ($user === null) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->name = $request->name;
    $user->phone = $request->phone;
    $user->email = $request->email;
    $user->address = $request->address;
    $user->gender = $request->gender;

    // Only update the password if it is provided
    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }
    
    $user->roles = 'customer';
    $user->status = 1;

    if ($request->image) {
        $imageData = $request->image; // Get Base64 image data
        $image = str_replace('data:image/png;base64,', '', $imageData); // Adjust based on your image type
        $image = str_replace(' ', '+', $image); // Replace spaces
        $fileName = date('YmdHis') . '.png'; // Define your image name and format
        \File::put(public_path('imgs/users/' . $fileName), base64_decode($image)); // Save the image

        $user->image = $fileName; // Store the filename in the database
    }

    $user->updated_at = now();
    $user->updated_by = Auth::id() ?? 1;
    $user->save();

    return response()->json(['message' => 'Update user successfully'], 200);
}


}
