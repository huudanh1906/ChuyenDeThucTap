<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
class UserController extends Controller
{
    /**
     * Handle login and logout request for admin users.
     */
    public function login(Request $request)
{
    $user = User::where('username', $request->username)
                ->where('status', 1)
                ->where('roles', 'admin') // Ensure roles is the correct column
                ->first();

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
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = User::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select(
                'id',
                'name',
                'gender',
                'roles',
                'image',
                'address',
                'email',
                'phone',
                'status'
            )
            ->get();
        return response()->json($list);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {

        $user=new User();
        $user->name=$request->name;
        $user->phone=$request->phone;
        $user->email=$request->email;
        $user->address=$request->address;
        $user->gender=$request->gender;
        $user->roles=$request->roles;
        $user->status=$request->status;
        $user->password=bcrypt($request->password);
        $user->username=$request->username;
        if ($request->hasFile('image')) {
            $fileName = date('YmdHis') . '.' . $request->image->extension();
            $request->image->move(public_path('imgs/users'), $fileName);
            $user->image = $fileName;
        }
        $user->created_at=date('Y-m-d H:i:s');
        $user->created_by = Auth::id()?? 1;

        $user->save();
        return response()->json(['message' => 'User created successfully.', 'user' => $user], 201);
    }



    public function show(string $id)
    {
        $user = User::find($id);
if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
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

    $user->roles = $request->roles;
    $user->status = $request->status;

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



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }


        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    public function stastus(string $id)
    {
        $user = User::find($id);
        if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->status = ($user->status == 1) ? 2 : 1;
        $user->updated_at = date('Y-m-d H:i:s');
        $user->updated_by = Auth::id() ?? 1;

        $user->save();
        return response()->json(['message' => 'User status updated successfully', 'status' => $user->status], 200);
    }
    public function delete(string $id)
    {
        $user = User::find($id);
        if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }


        $user->status = 0;
        $user->updated_at = date('Y-m-d H:i:s');
        $user->updated_by = Auth::id() ?? 1;

        $user->save();
        return response()->json(['message' => 'User moved to trash successfully'], 200);
    }
public function trash()
    {
        $list = User::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($list);
    }
    public function restore(string $id)
    {
        $user = User::find($id);
        if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->status = 2;
        $user->updated_at = date('Y-m-d H:i:s');
        $user->updated_by = Auth::id() ?? 1;

        $user->save();
        return response()->json(['message' => 'User restored successfully'], 200);
    }
    public function sendResetLink(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
    ]);

    $status = Password::sendResetLink(
        $validated
    );

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => 'Password reset link sent to your email.'], 200);
    }

    return response()->json(['error' => 'Unable to send reset link.'], 400);
}
}
