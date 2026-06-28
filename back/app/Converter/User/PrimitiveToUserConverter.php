<?php 

namespace App\Converter\User;

use App\Entity\User\User;
use DateTime;

final class PrimitiveToUserConverter {
    public function convert(object $primitive): User
    {
        return new User(
            $primitive->id,
            $primitive->username,
            $primitive->email,
            $primitive->password_hash ?? $primitive->password,
            $primitive->role_id ?? 1,
            (bool) ($primitive->is_banned ?? false),
            isset($primitive->created_at) ? new DateTime($primitive->created_at) : null,
            isset($primitive->updated_at) ? new DateTime($primitive->updated_at) : null,
            $primitive->token ?? null,
            isset($primitive->token_expiration_date) ? new DateTime($primitive->token_expiration_date) : null
        );
    }
}